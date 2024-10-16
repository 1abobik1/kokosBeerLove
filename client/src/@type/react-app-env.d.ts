declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

declare module 'react-slick' {
    import {Component} from 'react';

    export interface SliderProps {
        dots?: boolean;
        infinite?: boolean;
        speed?: number;
        slidesToShow?: number;
        slidesToScroll?: number;
        nextArrow?: JSX.Element;
        prevArrow?: JSX.Element;
        responsive?: Array<{
            breakpoint: number;
            settings: {
                slidesToShow: number;
                slidesToScroll: number;
            };
        }>;
        [key: string]: any; // Позволяет передавать другие свойства
    }

    export default class Slider extends Component<SliderProps> {}
}
