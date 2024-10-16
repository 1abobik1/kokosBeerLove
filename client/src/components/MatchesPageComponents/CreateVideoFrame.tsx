/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';
import {extractNumbersFromUrl} from '../../pages/generalPages/functions/linkParser';
import {IVideo} from '../../api/models/IVideo';

interface IframeType {
    video_url: string;
    hd?: number;
    width?: number;
    height?: number;
    autoplay?: number;
}

const CreateVideoFrame: React.FC<IframeType> = ({video_url, hd, width, height, autoplay}) => {
    const link = extractNumbersFromUrl(video_url);

    const iframeSrc = `https://vk.com/video_ext.php?oid=-${link?.firstNumber}&id=${link?.secondNumber}&hd=${hd}&autoplay=${autoplay ? 1 : 0}&js_api=1`;
    // const iframeSrc = `https://vk.com/video-${link?.firstNumber}_${link?.secondNumber}`

    return (
        <div>
            <iframe
                src={iframeSrc}
                width={width}
                height={height}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture;"
                frameBorder="0"
                allowFullScreen
                style={{width: '100%', maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto'}}
            ></iframe>
        </div>
    );
};

export default CreateVideoFrame;
