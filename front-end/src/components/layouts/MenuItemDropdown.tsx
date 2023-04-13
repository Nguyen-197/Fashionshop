import classNames from "classnames";
import { connect } from "react-redux";
import { IRootState } from 'src/reducers';
import { Link, withRouter } from "react-router-dom";

type IMenuItemDropdownProps = StateProps & DispatchProps & {
    handleClick: () => void;
    // handleHover: () => void;
    // handleLeaveHover: () => void;
    dropdownHover: Boolean;
    scrolled: Boolean;
    location: any;
    key: number;
    whiteText: Boolean;
    label: String;
    url: String;
    dropdownContent: any[];
    className: String;
}

const MenuItemDropdown = (props: IMenuItemDropdownProps) => {
    const dropdownHover = props.dropdownHover;
    const location = props.location;
    return (
        <li
            className="menu-item"
            onClick={() => props.handleClick && props.handleClick()}
        >
            <Link to={props.url}
                className={classNames({
                    active: location === props.url,
                    whitelink_header: props.whiteText === true,
                })}
            >{props.label}</Link>
            {/* {(dropdownHover === true && props.dropdownContent.length > 0) &&
                <Dropdown
                    className="dropdown-display"
                    dropdownContent={props.dropdownContent}
                    label={props.label}
                    scrolled={props.scrolled}
                    handleLeaveHover = {props.handleLeaveHover}
                />
            } */}
        </li>
    )
}

const mapStateToProps = ({ }: IRootState) => ({

});

const mapDispatchToProps = {

};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(MenuItemDropdown);