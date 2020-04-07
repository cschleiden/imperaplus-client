import * as React from "react";
import { useDispatch } from "react-redux";
import { GridColumn, GridRow } from "../../../components/layout";
import { MapView } from "../../../components/play/mapView";
import { Loading } from "../../../components/ui/loading";
import __ from "../../../i18n/i18n";
import { loadMapPreview } from "../../../lib/domain/game/mapPreview.slice";
import { MapTemplateCacheEntry } from "../../../lib/domain/game/play/mapTemplateCache";
import { setTitle } from "../../../lib/domain/shared/general/general.slice";
import { AppDispatch, AppNextPage } from "../../../store";
import style from "./mapPreview.module.scss";

interface IMapPreviewerProps {
    isLoading: boolean;
    mapTemplate: MapTemplateCacheEntry;
}

const MapPreview: AppNextPage<IMapPreviewerProps> = (props) => {
    const { isLoading, mapTemplate } = props;

    const dispatch = useDispatch<AppDispatch>();
    React.useEffect(() => {
        dispatch(setTitle(`${__("Preview")} : ${mapTemplate?.name}`));
    }, [mapTemplate]);

    return (
        <GridColumn className="col-xs-12">
            <GridRow>
                {isLoading && <Loading />}
                {!isLoading && (
                    <div className={style.mapPreview}>
                        <MapView mapTemplate={mapTemplate} />
                    </div>
                )}
            </GridRow>
        </GridColumn>
    );
};

MapPreview.needsLogin = true;
MapPreview.getTitle = () => __("Preview");
MapPreview.getInitialProps = async (ctx) => {
    const { map } = ctx.query;

    await ctx.store.dispatch(loadMapPreview(map as string));

    return {
        isLoading: ctx.store.getState().mapPreview.isLoading,
        mapTemplate: ctx.store.getState().mapPreview.mapTemplate,
    };
};

export default MapPreview;
