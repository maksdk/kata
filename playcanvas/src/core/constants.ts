
export  type AssetTypes = 'animation' | 'audio' | 'binary' | 'cubemap' | 'css' | 'font' | 'json' | 'html' | 'material' | 'model' | 'script' | 'shader' | 'text' | 'texture' | 'sprite';

export type Attributes = {
    [key: string]: {
        type: AttributeType;
        default?: unknown;
        title?: string;
        description?: string;
        placeholder?: string | string[];
        array?: boolean;
        size?: number;
        min?: number;
        max?: number;
        precision?: number;
        step?: number;
        assetType?: AssetTypes;
        curves?: string[];
        color?: string;
        enum?: { [key: string]: unknown }[];
        schema?: AttributeSchema[];
    };
};

export type AttributeSchema = Attributes & {
    name: string;
}

export enum AttributeType {
    Boolean = 'boolean',
    Number = 'number',
    String = 'string',
    JSON = 'json',
    Asset = 'asset',
    Entity = 'entity',
    RGB = 'rgb',
    RGBA = 'rgba',
    Vec2 = 'vec2',
    Vec3 = 'vec3',
    Vec4 = 'vec4',
    Curve = 'curve'
}