interface ITransformOptions {
    x?: number;
    y?: number;
    sx?: number;
    sy?: number;
    rotation?: number;
    maxWidth?: number;
    maxHeight?: number;
}

const defaultOptions: ITransformOptions = {
    x: 0,
    y: 0,
    sx: 1,
    sy: 1,
    rotation: 0,
    maxWidth: 0,
    maxHeight: 0,
};

export class Transform {
    private options: ITransformOptions = defaultOptions;

    public constructor(options: ITransformOptions = {}) {
        this.options = {
            ...defaultOptions,
            ...options || {},
        };
    }

    public get x(): number {
        return this.options.x;
    }

    public set x(v: number) {
        this.options.x = v;
    }

    public get y(): number {
        return this.options.y;
    }

    public set y(v: number) {
        this.options.y = v;
    }

    public get sx(): number {
        return this.options.sx;
    }

    public set sx(v: number) {
        this.options.sx = v;
    }

    public get sy(): number {
        return this.options.sy;
    }

    public set sy(v: number) {
        this.options.sy = v;
    }

    public get rotation(): number {
        return this.options.rotation;
    }

    public set rotation(v: number) {
        this.options.rotation = v;
    }

    public get maxWidth(): number {
        return this.options.maxWidth;
    }

    public set maxWidth(v: number) {
        this.options.maxWidth = v;
    }

    public get maxHeight(): number {
        return this.options.maxHeight;
    }

    public set maxHeight(v: number) {
        this.options.maxHeight = v;
    }
}