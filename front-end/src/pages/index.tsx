import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { LOCALE_OPTIONS } from 'src/constants';
import { setLocale } from 'src/reducers/locale';
import { useHistory } from 'react-router-dom';
import VideoShort from '../assets/images/hightlight_short.mp4';
import Home from './home/Home'
type IPageIndexProps = StateProps & DispatchProps & {
}

const PgaeIndex = (props: IPageIndexProps) => {

    return (
        <>
           <Home/>
        </>
    )
}

const mapStateToProps = ({  }: IRootState) => ({

});

const mapDispatchToProps = {
    setLocale
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(PgaeIndex);
