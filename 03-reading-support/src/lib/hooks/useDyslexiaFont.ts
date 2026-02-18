import { useDyslexiaFontContext } from '../../components/dyslexia-font/DyslexiaFontProvider';

export const useDyslexiaFont = () => {
    const { font, setFont, toggleFont } = useDyslexiaFontContext();

    return {
        font,
        isDyslexicFont: font === 'opendyslexic',
        setFont,
        toggleFont,
    };
};
