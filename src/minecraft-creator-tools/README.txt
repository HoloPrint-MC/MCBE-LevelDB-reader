This folder contains the actual LevelDb reader implementation, which is adapted from https://github.com/Mojang/minecraft-creator-tools
I have taken LevelDb.ts and necessary related files, relocated them around, and changed imports.
I have also removed unused methods, interface members etc. in order to keep this library minimal.
I also made some methods and fields annotated with "private" actual private properties (e.g. private _isLazyMode -> #isLazyMode) so that bundlers can minify their names.
