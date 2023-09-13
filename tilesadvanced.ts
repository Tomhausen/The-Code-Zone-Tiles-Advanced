//% weight=0 color=#13a89e icon="\uf041" block="Tiles Advanced"
//% advanced=false
//% groups="['Local Tiles', 'Tilemap Population', 'Tile Comparisons', 'Tile Animation', 'Pathfinding']"

namespace tilesAdvanced {
    /**
     * Returns a list of tiles in a plus sign within a tile in a given range
     */
    //% blockId=getAdjacentTiles
    //% block="get tiles near to $tile within $distance"
    //% group="Local Tiles"
    //% weight=20
    export function getAdjacentTiles(tile: tiles.Location, distance: number): tiles.Location[] {
        let i: number;
        let col = tile.col;
        let row = tile.row;
        let adjacent_tiles = [tile];

        for (i = 0; i < distance; i++) {
            adjacent_tiles.push(tiles.getTileLocation(col - i, row))
        }
        for (i = 0; i < distance; i++) {
            adjacent_tiles.push(tiles.getTileLocation(col + i, row))
        }
        for (i = 0; i < distance; i++) {
            adjacent_tiles.push(tiles.getTileLocation(col, row - i))
        }
        for (i = 0; i < distance; i++) {
            adjacent_tiles.push(tiles.getTileLocation(col, row + i))
        }
        return adjacent_tiles
    }

    /**
     * Returns true if the given tiles are the same tile
     */
    //% blockId=tileIsTile
    //% block="$tile is $otherTile"
    //% group="Tile Comparisons"
    //% weight=20
    export function tileIsTile(tile: tiles.Location, otherTile: tiles.Location): boolean {
        if (tile.col == otherTile.col && tile.row == otherTile.row) {
            return true
        }
        return false
    }

    /**
     * Returns true if the given tile is in the list of tiles provided
     */
    //% blockId=tileIsInList
    //% block="$tile is in $tileList"
    //% group="Tile Comparisons"
    //% weight=20
    export function tileIsInList(tile: tiles.Location, tileList: tiles.Location[]): boolean {
        for (let tileInList of tileList) {
            if (tileIsTile(tile, tileInList)) {
                return true
            }
        }
        return false
    }

    /**
     * Sets the wall on or off for all tiles of a given type
     */
    //% blockId=setWallOnTilesOfType
    //% block="set walls $makeWall on tiles of type $tile"
    //% group="Tilemap Population"
    //% weight=20
    export function setWallOnTilesOfType(tile: Image, makeWall: boolean) {
        for (let tileOfType of tiles.getTilesByType(tile)) {
            tiles.setWallAt(tileOfType, makeWall)
        }
    }

    /**
     * Animates all tiles of the given type with the animation passed in on the interval given
     */
    //% blockId=animateTileOfTypeWith
    //% block="animate $tile with $animation every $frameLength"
    //% group="Tile Animation"
    //% weight=20
    export function animateTileOfTypeWith(tile: Image, animation: Image[], frameLenght: number) {
        let frame = 0
        let tilesToAnimate = tiles.getTilesByType(tile)
        game.onUpdateInterval(frameLenght, function animateTiles() {
            for (let tileOfType of tilesToAnimate) {
                tiles.setTileAt(tileOfType, animation[frame])
            }
            frame += 1
            if (frame == animation.length - 1) {
                frame = 0
            }
        })
    }

    /**
     * Makes this sprite follow the target sprite using pathfinding
     */
    //% blockId=followUsingPathfinding
    //% block="set %sprite(myEnemy) follow %target=variables_get(mySprite) || with speed %speed"
    //% group="Pathfinding"
    //% weight=20
    export function followUsingPathfinding(sprite: Sprite, target: Sprite, speed = 100) {
        let myStart = sprite.tilemapLocation();
        if (speed == 0){
            let path = scene.aStar(myStart, myStart);
            scene.followPath(sprite, path)
            sprite.say("")
            return
        }
        let path = scene.aStar(myStart, target.tilemapLocation());
        scene.followPath(sprite, path, speed);
        game.onUpdate(function tick() {
            if (!tileIsTile(sprite.tilemapLocation(), myStart)) {
                myStart = sprite.tilemapLocation();
                path = scene.aStar(myStart, target.tilemapLocation());
                scene.followPath(sprite, path, speed);
            }
            sprite.say("following")
        })
    }
}


