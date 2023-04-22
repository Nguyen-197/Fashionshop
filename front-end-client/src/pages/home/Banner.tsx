import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
const Banner = (props) => {
    const collection = props.collection;
    const [currentBanner, setCurrentBanner] = useState(1);

    useEffect(()=>{
        const slide = setInterval(() => {
            setCurrentBanner(currentBanner + 1)
        }, 3500);
        return () => {
            clearInterval(slide);
        }
    }, [currentBanner]);


    if (currentBanner > 2) {
        setCurrentBanner(1);
    }

    if (currentBanner < 1) {
        setCurrentBanner(2);
    }

    const onPrev = (event: any) => {
        event.preventDefault();
        setCurrentBanner((preState) => {
            return preState - 1;
        })
    }
    const onNext = (event: any) => {
        event.preventDefault();
        setCurrentBanner((preState) => {
            return preState + 1;
        })
    }

    const onSelected = (value) => {
        setCurrentBanner(value);
    }

    return (
        <div className="carousel slide flex-center mt-100">
            {/* <button className="carousel-control-prev" onClick={onPrev}>
                <i className="chevron-left"></i>
            </button> */}
            <div className="banner-container">
                <div className={classNames("banner-first flex-center", { hide: currentBanner !== 1 })}>
                </div>
                <div className={classNames("banner-second flex-center", { hide: currentBanner !== 2 })}>
                </div>
                {/* <div className={classNames("banner-third flex-center", { hide: currentBanner !== 3 })}>
                </div>
                <div className={classNames("banner-four flex-center", { hide: currentBanner !== 4 })}>
                </div> */}
            </div>
            {/* <button className="carousel-control-next" onClick={onNext}>
                <i className="chevron-right"></i>
            </button> */}
            <div className="navigation-wrapper">
                <ul>
                    <li onClick={() => onSelected(1)} className={classNames("dots-item", { active: currentBanner == 1 })}>
                        <button></button>
                    </li>
                    <li onClick={() => onSelected(2)} className={classNames("dots-item", { active: currentBanner == 2 })}>
                        <button></button>
                    </li>
                    {/* <li onClick={() => onSelected(3)} className={classNames("dots-item", { active: currentBanner == 3 })}>
                        <button></button>
                    </li>
                    <li onClick={() => onSelected(4)} className={classNames("dots-item", { active: currentBanner == 4 })}>
                        <button></button>
                    </li> */}
                </ul>
            </div>
        </div>
    )
}
export default withRouter(Banner);