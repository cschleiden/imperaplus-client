import * as React from "react";

export default (): JSX.Element => {
    return <ul className="nav">
        <li>
            <a href="#">Home</a>
        </li>
        <li>
            <a href="#">Signup</a>
        </li>
        <li>
            <a href="#">Login</a>
            <ul className="nav-dropdown">
                <li>
                    <a href="#">Home</a>
                </li>
                <li>
                    <a href="#">Home</a>
                </li>
            </ul>
        </li>
        <li>
            <a href="#">Login</a>
            <ul className="nav-dropdown">
                <li>
                    <a href="#">Home</a>
                </li>
                <li>
                    <a href="#">Home</a>
                </li>
            </ul>
        </li>
    </ul>;
};