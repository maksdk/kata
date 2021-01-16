docker run --rm -w "/builder" -v "${PWD}:/builder" heroiclabs/nakama-pluginbuilder:2.7.0 build --buildmode=plugin -trimpath -ldflags "-X main.environment=development" -o "modules/engine.so"
