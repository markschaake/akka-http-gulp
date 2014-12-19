package cert

import scala.collection.mutable
import JsonProtocol._
import spray.json._

abstract class Enum[T <: Enum[T]](val id: String)
trait EnumCompanion[T <: Enum[T]] {
  private var registry = mutable.Map[String, T]()
  def register(values: T*): Unit = values foreach { value =>
    registry(value.id) = value
  }

  def withId(id: String): T = registry(id)

  implicit object JsFormat extends RootJsonFormat[T] {
    override def read(jsValue: JsValue): T = jsValue match {
      case JsString(id) => withId(id)
      case _            => deserializationError("Enum must be a JsString")
    }
    override def write(t: T): JsValue = JsString(t.id)
  }
}
