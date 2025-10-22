# amateras/css

## Usage
```ts
import 'amateras';
import 'amateras/css';
```

## Define Style
```ts
const style = $.css({
    backgroundColor: 'black',
    margin: 0,

    'p': {
        color: 'blue'

        '@media (max-width: 800px)': {
            color: 'red'
        }
    }
})

$(document.body).css(style).content([
    $('p').content('Text with blue color.')
]);
```

## Define Style in Method Chain
```ts
$(document.body).content([
    $('h1').css({ color: 'red' }).content('This is a title with red color!')
])
```

## Define Variables

### Single Variable
```ts
const largeText = $.css.variables('1.2rem');

$.css({
    fontSize: largeText
})
```

### Variable Group
```ts
const text = $.css.variables({
    small: '0.8rem',
    medium: '1rem',
    large: '1.2rem'
})

$.css({
    fontSize: text.large
})
```

## Define Keyframes
```ts
const keyframes = $.css.keyframes({
    fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 }
    },
    fadeOut: {
        from: { opacity: 1 },
        to: { opacity: 0 }
    }
})

$.css({
    animation: keyframes.fadeIn
})
```

## Define CSS Rules with Selectors
```ts
$.CSS({
    'html': {
        fontSize: '18px',
        fontFamily: 'Noto Sans',

        'body': {
            margin: 0,

            '.title': {
                color: 'red'
            }
        }
    },

    '@media (max-width: 800px)': {
        'html': {
            fontSize: '1rem',

            '@media (orientation: landscape)': {
                fontSize: '1.2rem'
            },
        }
    },
})

$(document.body).content([
    $('h1').class('title').content('A red color title.')
])

```

### CSS Colors Preset
You can import colors preset from `amateras/color/COLOR_NAME` or `amateras/colors` path. These colors are reference from Tailwind colors, read the [documentation](https://tailwindcss.com/docs/colors) to know about the concepts.
```ts
// import black and white color preset
import 'amateras/color/blackwhite';
$.color.black; // '#000000'
$.color.white; // '#ffffff'

// import slate colors preset
import 'amateras/color/slate';
$.color.slate[100]; // '#f1f5f9'
$.color.slate[200]; // '#e2e8f0'

// import all colors preset
import 'amateras/colors';
$.color.red[600]; // '#dc2626'
$.color.zinc[500]; // '#71717a'
```