import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from '@mui/material';
import frameShop from '../../images/frame_shop.jpg';
import {ShopResponse} from '../../api/models/response/ShopResponse';
import './ShopCard.css';
import {AltRoute} from '@mui/icons-material';
import imgredline from '../../images/Rectangle40.png';
import tshirt from '../../images/T-shirt Mockup.png';

const ShopCard: React.FC<ShopResponse> = ({id, name, description}) => {
    return (
        <Link to={`/shop/${id}`} className="shop-card">
            <div className="shopcard-container">
                <div className="shopcard-img">
                    <img src={tshirt} alt="error" />
                </div>

                <div className="shopcard-preview-text">
                    <h3 className="shopcard-title">{name}</h3>
                    <p className="shopcard-description">{description}</p>
                </div>

                <div className="shopcard-action">
                    <Button variant="contained" color="error" className="shop-order-button">
                        Заказать
                    </Button>
                </div>

                <img src={imgredline} alt="error" className="redline" />
            </div>
        </Link>
    );
};

export default ShopCard;

{
    /* <div className="shop-content-img">
<img src={url_images[0]} alt={name} className="shop-image"/>
</div>
<div className="shop-content-text">
<h3 className="shop-title">{name}</h3>
<p className="shop-description">{description}</p>
</div>
<div>
<p className="shop-price">{price} ₽</p>
</div>
<div className="shop-content-action">
<Button variant="contained" color="error" className="shop-order-button">Заказать</Button>
</div> */
}
