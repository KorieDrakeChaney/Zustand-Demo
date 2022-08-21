

import { Texture, TextureLoader } from 'three'
import { StaticImageData } from 'next/image'




export const imageToTexture = (data : Array<StaticImageData>):Array<Texture> => { 
    let i = 0;
    let textures = Array(data.length)
    for(const img of data){
        textures[i] = new TextureLoader().load( img.src )
        i++;
    }
    return textures; 
}