import { Room, Client } from "colyseus";
import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

class Question extends Schema {
  @type("string")
  question: string;
  @type("string")
  answer: string;
  @type("boolean")
  isBonus: boolean;
}

function createQ(q: string,a: string,b: boolean) {
  var qu = new Question()
  qu.question = q
  qu.answer = a
  qu.isBonus = b
  return qu
}

class Player extends Schema {
    @type("number")
    x: number;

    @type("number")
    y: number;

    @type("string")
    nickname: string;

    @type("string")
    color: string;
}

class GameState extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();
    @type([ Question ])
    questions = new ArraySchema<Question>();
}

export class basic extends Room {
  onCreate (options: any) {
    console.log("Mazopolis C Game Created")
    this.setState(new GameState())
    this.state.questions.push(createQ("Do you like tacos?","yes",false))
    this.state.questions.push(createQ("HOW AE YOU!?","good",true))
  }

  onJoin (client: Client, options: any) {
    var colors = [
      // green
      "#26AC4B",
      // purple
      "#7740D1",
      // red
      "#C64646",
      // yellow
      "#F4D03F",
      // orange
      "#FF5733",
      // dark aqua
      "#2A6264"
    ]
    console.log("player joined.")
    let secretcolor = colors[Math.floor(Math.random() * colors.length)];
    this.state.players[client.sessionId] = new Player()
    this.state.players[client.sessionId].x = 0 
    this.state.players[client.sessionId].y = 0
    this.state.players[client.sessionId].color = secretcolor
    this.state.players[client.sessionId].nickname = options.nickname
  }

  onMessage (client: Client, message: any) {
    var msg = message
    if(msg) {
      if(msg.event == "move") {
        this.state.players[client.sessionId].x = msg.pos.x
        this.state.players[client.sessionId].y = msg.pos.y
      }
    }
  }

  onLeave (client: Client, consented: boolean) {
    console.log("A client left. Just leaving them hanging!")
    this.broadcast({event:"leave",who: client.sessionId})
  }

  onDispose() {
    console.log("server died.")
  }

}
