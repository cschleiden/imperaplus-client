import * as React from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers";
import { GridColumn, GridRow } from "../../components/layout";
import { MapView } from "../play/components/mapView";
import { MapTemplateCacheEntry } from "../play/mapTemplateCache";
import { loadMapPreview } from "./mapPreview.actions";
import { Loading } from "../../components/ui/loading";
import "./mapPreview.scss";
import { setTitle } from "../../common/general/general.actions";

interface IMapPreviewerProps {
    params: {
        name: string;
    };

    isLoading: boolean;
    mapTemplate: MapTemplateCacheEntry;

    loadMapTemplate: (name: string) => void;
    setTitle: (title: string) => void;
}

export class MapPreviewerComponent extends React.Component<IMapPreviewerProps> {
    componentDidMount() {
        const { loadMapTemplate, params } = this.props;

        loadMapTemplate(params.name);
    }

    componentDidUpdate() {
        const { mapTemplate, setTitle } = this.props;

        if (mapTemplate) {
            setTitle(__("Preview") + ": " + mapTemplate.mapTemplate.name);
        }
    }

    render(): JSX.Element {
        const { isLoading, mapTemplate } = this.props;

        return (
            <GridRow>
                {
                    isLoading && <Loading />
                }
                {
                    !isLoading && <div className="map-preview">
                        <MapView mapTemplate={mapTemplate} />
                    </div>
                }
            </GridRow>
        );
    }
}

export default connect((state: IState) => ({
    isLoading: state.mapPreview.data.isLoading,
    mapTemplate: state.mapPreview.data.mapTemplate
}), (dispatch) => ({
    loadMapTemplate: (name: string) => { dispatch(loadMapPreview(name)); },
    setTitle: (title: string) => { dispatch(setTitle(title)); }
}))(MapPreviewerComponent);