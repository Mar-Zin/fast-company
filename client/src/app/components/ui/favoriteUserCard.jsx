import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { getProfessionById } from "../../store/professions";
import { toggleBookmark } from "../../store/users";
import Qualities from "./qualities";

const FavoriteUserCard = ({ user }) => {
    const dispatch = useDispatch();
    const profession = useSelector(getProfessionById(user.profession));
    return (
        <div className="card mb-3 me-3">
            <div className="card-body">
                <button
                    className="position-absolute top-0 end-0 btn btn-light btn-sm"
                    onClick={() => dispatch(toggleBookmark(user._id))}
                >
                    <i className="bi bi-heart-fill"></i>
                </button>

                <div className="d-flex flex-column align-items-center text-center position-relative mb-3">
                    <img
                        src={user.image}
                        className="rounded-circle"
                        alt="avatar"
                        width="150"
                    />
                    <div className="mt-3">
                        <h4>{user.name}</h4>
                        <p className="text-secondary mb-1">{profession.name}</p>
                        <div className="text-muted">
                            <i
                                className="bi bi-caret-down-fill text-primary"
                                role="button"
                            ></i>
                            <i
                                className="bi bi-caret-up text-secondary"
                                role="button"
                            ></i>
                            <span className="ms-2">{user.rate}</span>
                        </div>
                    </div>
                </div>
                <div className="card mb-3">
                    <div className="card-body d-flex flex-column justify-content-center text-center">
                        <h5 className="card-title">
                            <span>Qualities</span>
                        </h5>
                        <p className="card-text">
                            <Qualities qualities={user.qualities} />
                        </p>
                    </div>
                </div>
                <div className="card mb-3">
                    <div className="card-body d-flex flex-column justify-content-center text-center">
                        <h6 className="card-title">
                            <span>Completed meetings</span>
                        </h6>

                        <span style={{ fontWeight: "bold" }}>
                            {user.completedMeetings}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
FavoriteUserCard.propTypes = {
    user: PropTypes.object,
    id: PropTypes.string
};

export default FavoriteUserCard;
