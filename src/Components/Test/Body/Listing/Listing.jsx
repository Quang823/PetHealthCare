
import React from "react";
import './Listing.scss';
import { AiFillHeart } from "react-icons/ai";
import { TbArrowNarrowRight } from "react-icons/tb";
import service1 from '../../../../Assets/hinh-thu-cung-cute-dep-nhat_014120300.jpg';
import service2 from '../../../../Assets//hinh-thu-cung-cute-dep-nhat_014120300.jpg';
import service4 from '../../../../Assets//hinh-thu-cung-cute-dep-nhat_014120300.jpg';
import service5 from '../../../../Assets//hinh-thu-cung-cute-dep-nhat_014120300.jpg';
import dog1 from '../../../../Assets//hinh-thu-cung-cute-dep-nhat_014120300.jpg';
import dog2 from '../../../../Assets//hinh-thu-cung-cute-dep-nhat_014120300.jpg';
import dog3 from '../../../../Assets/hinh-thu-cung-cute-dep-nhat_014120300.jpg';
const Listing = () => {
    return (
        <div className="lisitingSection">
            <div className="heading flex">
                <h1>Top Service</h1>
                {/* <button className="btn flex">
                    See All <TbArrowNarrowRight className="icon" />
                </button> */}
            </div>
            <div className="secContainer flex">
                <div className="singleItem">
                    <AiFillHeart className="icon" />
                    <img src={service1} alt="Service" />
                    <h3>Cao long cu</h3>
                </div>
                <div className="singleItem">
                    <AiFillHeart className="icon" />
                    <img src={service2} alt="Service" />
                    <h3>Tam rua </h3>
                </div>
                <div className="singleItem">
                    <AiFillHeart className="icon" />
                    <img src={service4} alt="Service" />
                    <h3>Cat mong tay</h3>
                </div>
                <div className="singleItem">
                    <AiFillHeart className="icon" />
                    <img src={service5} alt="Service" />
                    <h3>Chill</h3>
                </div>
            </div>
            <div className="sellers flex">
                <div className="topSellers">
                    <div className="heading flex">
                        <h3>Top seller</h3>
                    </div>
                    <div className="card flex">
                        <div className="users ">
                            <img src={dog1} alt="User image" />
                            <img src={dog2} alt="User image" />
                            <img src={dog3} alt="User image" />
                        </div>
                        <div className="cardText">
                            <span>
                                14.556 service sold <br />
                                <small>
                                    211 Dog <span className="date">7 Days</span>
                                </small>
                            </span>
                        </div>
                    </div>

                </div>
                <div className="featuredSellers">
                    <div className="heading flex">
                        <h3>Freature seller</h3>
                    </div>
                    <div className="card flex">
                        <div className="users ">
                            <img src={dog1} alt="User image" />
                            <img src={dog2} alt="User image" />
                            <img src={dog3} alt="User image" />
                        </div>
                        <div className="cardText">
                            <span>
                                14.556 service sold <br />
                                <small>
                                    211 Dog <span className="date">7 Days</span>
                                </small>
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Listing;
