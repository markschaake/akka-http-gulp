package cert

import akka.actor._
import akka.http.Http
import akka.http.marshallers.sprayjson.SprayJsonSupport
import akka.http.marshalling._
import akka.http.model.StatusCodes
import akka.http.server.Directives._
import akka.stream.FlowMaterializer
import com.typesafe.config.ConfigFactory
import spray.json._
import spray.json.DefaultJsonProtocol._

object WebServer extends App
    with PredefinedToEntityMarshallers
    with SprayJsonSupport {

  implicit val system = ActorSystem()
  implicit val materializer = FlowMaterializer()
  import system.dispatcher

  val config = ConfigFactory.load().getConfig("insurance-cert")
  val port = config.getInt("port")

  val binding = Http(system).bind(interface = "localhost", port = port)
  system.log.info("Listening on http://localhost:8080")

  val apiVersion1 = {
    // format: OFF
    pathEndOrSingleSlash {
      get {
        complete(JsObject("foo" -> "bars".toJson))
      }
    } ~
    path("foos") {
      get {
        complete(JsArray("foo".toJson, "bar".toJson))
      } ~
      post {
        entity(as[JsObject]) { js =>
          complete(js)
        }
      }
    }
    // format: ON
  }

  binding startHandlingWith {
    pathPrefix("api" / IntNumber) {
      case 1     => apiVersion1
      case other => complete(StatusCodes.BadRequest -> s"version $other not supported")
    }
  }
}
