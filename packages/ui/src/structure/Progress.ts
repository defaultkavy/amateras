import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";
import { Utils } from "@amateras/utils";

export interface ProgressProps {
    value: OrSignal<number>
}

export class Progress extends ElementProto {
    static tagname = 'progress-bar';
    $value: ProgressValue | null = Utils.Null;
    constructor(props: $.Props, layout?: $.Layout<Progress>) {
        super(Progress.tagname, props, () => {
            $(ProgressValue)
            layout?.(this);
        })
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            height: 'var(--spacing)',
            background: 'color-mix(in srgb, var(--input), transparent 30%)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden'
        }))
    }

    override props({ value, ...props }: $.Props): void {
        super.props(props)
        this.value(value);
    }

    value(): number;
    value(value?: OrSignal<number>): void;
    value(value?: OrSignal<number>) {
        if (!arguments.length) return Number(this.attr('value'));
        if (Utils.isUndefined(value)) return;
        $.resolve(value, value => {
            this.attr('value', `${value}`);
            this.$value?.style({ translate: `-${Math.min(Math.max(100 - value, 0), 100)}% 0` })
        })
    }
}

class ProgressValue extends ElementProto {
    static tagname = 'progress-value';
    $progress: Progress | null = Utils.Null;
    constructor(props: $.Props) {
        super(ProgressValue.tagname, props)
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            height: 'var(--spacing)',
            background: 'var(--primary-bg)',
            borderRadius: 'var(--radius)',
            transition: 'all .3s ease'
        }))
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$progress = this.findAbove<Progress>(proto => Utils.is(proto, Progress))
        if (this.$progress) {
            this.$progress.$value = this;
            this.$progress.value(this.$progress.value())
        }
        return this;
    }
}