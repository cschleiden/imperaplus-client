import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { Children } from "react";

const ActiveLink = ({
    children,
    activeClassName,
    indexRoute = false,
    ...props
}) => {
    const { pathname } = useRouter();
    const child = Children.only(children);

    const className =
        pathname === props.href ||
        (indexRoute && pathname.startsWith(`${props.href}/`))
            ? `${child.props.className} ${activeClassName}`
            : child.props.className;

    //@ts-ignore
    return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
};

ActiveLink.propTypes = {
    activeClassName: PropTypes.string.isRequired,
};

export default ActiveLink;
