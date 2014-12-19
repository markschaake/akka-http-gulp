package cert.auth

import cert.{ Enum, EnumCompanion }

sealed abstract class Priviledge(id: String) extends Enum[Priviledge](id)

object Priviledge extends EnumCompanion[Priviledge] {
  case object Admin extends Priviledge("admin")
  register(Admin)
}
