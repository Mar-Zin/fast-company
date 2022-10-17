import React from "react";
import { useSelector } from "react-redux";
import FavoriteUserCard from "../components/ui/favoriteUserCard";
import { getCurrentUserData, getUserById } from "../store/users";

const Favorites = () => {
    const currentUser = useSelector(getCurrentUserData());
    const bookmarks = currentUser.bookmark ? currentUser.bookmark : "";

    return (
        <>
            <h4 style={{ textAlign: "center", marginBottom: 20 }}>
                Избранные пользователи
            </h4>
            <div
                className="d-flex flex-wrap justify-content-center"
                style={{ margin: "0 auto" }}
            >
                {bookmarks ? (
                    bookmarks.map((id) => (
                        <FavoriteUserCard
                            key={id}
                            user={useSelector(getUserById(id))}
                        />
                    ))
                ) : (
                    <span style={{ display: "block" }}>
                        Здесь появятся пользователи, которых вы добавите в
                        избранное
                    </span>
                )}
            </div>
        </>
    );
};

export default Favorites;
