/**
* Adds additional tilemap functionality
*/
//% weight=0 color=#13a89e icon="\uf041" block="Tiles Advanced"
//% advanced=false
//% groups="['Getting Tiles', 'Tilemap Population', 'Tile Comparisons', 'Tile Animation', 'Pathfinding']"

namespace tilesAdvanced {

    /**
     * Returns a list of tiles in a plus sign within a tile in a given range
     */
    //% blockId=getAdjacentTiles
    //% block="get tiles near to $tile within $distance"
    //% tile.shadow=mapgettile
    //% group="Getting Tiles"
    //% weight=100
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
    //% tile.shadow=mapgettile
    //% otherTile.shadow=mapgettile
    //% group="Tile Comparisons"
    //% weight=100
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
    //% block="$tile is in $tileList=variables_get(list)"
    //% tile.shadow=mapgettile
    //% group="Tile Comparisons"
    //% weight=3
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
    //% tile.shadow=tileset_tile_picker
    //% tile.decompileIndirectFixedInstances=true
    //% group="Tilemap Population"
    //% weight=4
    export function setWallOnTilesOfType(tile: Image, makeWall: boolean) {
        for (let tileOfType of tiles.getTilesByType(tile)) {
            tiles.setWallAt(tileOfType, makeWall)
        }
    }

    /**
     * All tiles of the same design have their image swapped for a given design
     */
    //% blockId=swapAllTiles
    //% block="swap tiles $from to $to"
    //% from.shadow=tileset_tile_picker
    //% from.decompileIndirectFixedInstances=true
    //% to.shadow=tileset_tile_picker
    //% to.decompileIndirectFixedInstances=true
    //% group="Tilemap Population"
    //% weight=5
    export function swapAllTiles(from: Image, to: Image) {
        for (let tileOfType of tiles.getTilesByType(from)) {
            tiles.setTileAt(tileOfType, to);
        }
    }

    /**
     * Center the given sprite on a random location that is the given type (image) and is off screen
     * @param sprite
     * @param tile
     */
    //% blockId=placeOnRandomTileOffScreen
    //% block="place $sprite=variables_get(mySprite) on top of random $tile off screen"
    //% tile.shadow=tileset_tile_picker
    //% tile.decompileIndirectFixedInstances=true
    //% help=tiles/place-on-random-tile
    //% group="Tilemap Population"
    //% weight=6
    export function placeOnRandomTileOffScreen(sprite: Sprite, tile: Image) {
        let currentScene = game.currentScene();
        tiles.placeOnRandomTile(sprite, tile);
        if ((sprite.right > currentScene.camera.left && sprite.left < currentScene.camera.right) ||
            (sprite.bottom > currentScene.camera.top && sprite.top < currentScene.camera.bottom)) {
            placeOnRandomTileOffScreen(sprite, tile);
        }
    }
        
    /**
     * Returns a list of all the tiles that are a wall
     */
    //% blockId=getAllWallTiles
    //% block="array of all wall tiles"
    //% group="Getting Tiles"
    //% weight=6
    export function getAllWallTiles(): tiles.Location[] {
        let width = getTilemapWidth() - 1;
        let height = getTilemapHeight() - 1;
        let walls = [];
        for (let w = 0; w < width; w++) {
            for (let h = 0; h < height; h++) {
                let tile = tiles.getTileLocation(w, h);
                if (tiles.tileAtLocationIsWall(tile)) {
                    walls.push(tile);
                }
            }
        }
        return walls;
    }

    /**
     * Returns the width of the tilemap in use
     */
    //% blockId=getTilemapWidth
    //% block="get tilemap width"
    //% group="Getting Tiles"
    //% weight=7
    export function getTilemapWidth(): number {
        return game.currentScene().tileMap.data.width;
    }

    /**
     * Returns the height of the tilemap in use
     */
    //% blockId=getTilemapHeight
    //% block="get tilemap height"
    //% group="Getting Tiles"
    //% weight=8
    export function getTilemapHeight(): number {
        return game.currentScene().tileMap.data.height;
    }

    /**
     * Animates all tiles of the given type with the animation passed in on the interval given
     */
    //% blockId=animateTileOfTypeWith
    //% block="animate $tile with $animation=animation_editor || every $frameLength"
    //% tile.shadow=tileset_tile_picker
    //% tile.decompileIndirectFixedInstances=true
    //% expandableArgumentMode="toggle"
    //% frameLength.defl=200
    //% group="Tile Animation"
    //% weight=6
    export function animateTileOfTypeWith(tile: Image, animation: Image[], frameLength: number = 200) {
        let frame = 0
        let tilesToAnimate = tiles.getTilesByType(tile)
        game.onUpdateInterval(frameLength, function animateTiles() {
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
     * Returns true if one sprite can see another without a wall in the way
     */
    //% blockId=checkLineOfSight
    //% block="can %sprite=variables_get(myEnemy) see %target=variables_get(mySprite)"
    //% group="Pathfinding"
    //% weight=9
    export function checkLineOfSight(sprite: Sprite, target: Sprite): boolean {
        let xDif = target.x - sprite.x
        let yDif = target.y - sprite.y
        // let distance = Math.sqrt(xDif ** 2 + yDif ** 2) // inventing triangles 
        let xIncrement = xDif / 25
        let yIncrement = yDif / 25
        for (let i = 0; i < 25; i++) {
            let x = sprite.x + i * xIncrement
            let y = sprite.y + i * yIncrement
            let col = Math.floor(x / 16)
            let row = Math.floor(y / 16)
            if (tiles.tileAtLocationIsWall(tiles.getTileLocation(col, row))) {
                return false
            }
        }
        return true
    }

    export class PathfinderSprite extends Sprite {

        public isFollowing: boolean = false;

        constructor(image: Image, kind: number) {
            super(image);
            this.kind = kind;
        }
    }
    
    /**
     * Creates a sprite capable of carrying out advanced pathfinding
     */
    //% blockId=createPathfinderSprite
    //% block="pathfinder sprite %img=screen_image_picker of kind %kind=spritekind"
    //% group="Pathfinding"
    //% weight=6
    export function createPathfinderSprite(image: Image, kind: number): PathfinderSprite{
        const sprite = new PathfinderSprite(image, kind);
        game.currentScene().physicsEngine.addSprite(sprite);
        return sprite;
    }

    /**
     * Makes this sprite follow the target sprite using pathfinding
     */
    //% blockId=followUsingPathfinding
    //% block="set %sprite=variables_get(myEnemy) follow %target=variables_get(mySprite) || with speed %speed"
    //% group="Pathfinding"
    //% weight=7
    export function followUsingPathfinding(sprite: PathfinderSprite, target: Sprite, speed = 100) {
        let myStart = sprite.tilemapLocation();
        let path = scene.aStar(myStart, target.tilemapLocation());
        sprite.isFollowing = true;
        scene.followPath(sprite, path, speed);
        while (sprite.isFollowing) {
            if (!tileIsTile(sprite.tilemapLocation(), myStart)) {
                myStart = sprite.tilemapLocation();
                path = scene.aStar(myStart, target.tilemapLocation());
                scene.followPath(sprite, path, speed);
            }
        }
    }

    /**
     * Stops the path finding sprite from following the path
     */
    //% blockId=stopFollowingPath
    //% block="stop %sprite=variables_get(myEnemy) following path"
    //% group="Pathfinding"
    //% weight=8
    export function stopFollowingPath(sprite: PathfinderSprite) {
        sprite.isFollowing = false;
    }
}
