resolvers += Resolver.url("bintray-allenai-sbt-plugin-releases",
  url("http://dl.bintray.com/content/marks/sbt-plugins"))(Resolver.ivyStylePatterns)

resolvers += Resolver.defaultLocal

addSbtPlugin("markschaake" % "markschaake-sbt-plugins" % "0.0.4-SNAPSHOT")
