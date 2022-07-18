import React, { createContext, forwardRef, useContext } from "react";
import { FixedSizeList as List } from "react-window";

const Header = ({ index, style }) => (
    <div className="sticky" style={style}>
        Sticky Row {index}
    </div>
);

const Row = ({ index, style }) => (
    <div className="row" style={style}>
        Row {index}
    </div>
);

function TableVirtualized({ children, ...rest }) {
    return (
        <>
        </>
    )
}

export default TableVirtualized