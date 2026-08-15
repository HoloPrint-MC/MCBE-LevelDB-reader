This folder contains the actual LevelDb reader implementation, which is adapted from https://github.com/Mojang/minecraft-creator-tools
I have taken LevelDb.ts and necessary related files, relocated them around, and changed imports.
Most notably, logging has been extracted from relying on the Log static class to be configurable in the constructor. It defaults to console logs if nothing is provided.
The first parameter in the init() method, originally a log callback function, has been extracted into a property in the logger passed in the constructor. No idea why Mojang decided to not use the regular logger originally.
I have also removed unused methods, interface members etc. in order to keep this library minimal.
I also made some methods and fields annotated with "private" actual private properties (e.g. private _isLazyMode -> #isLazyMode) so that bundlers can minify their names.
