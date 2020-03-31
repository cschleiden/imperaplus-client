import * as React from "react";
import { connect } from "react-redux";
import { setTitle } from "../../common/general/general.actions";
import { GridRow, GridColumn } from "../../components/layout";
import { Loading } from "../../components/ui/loading";
import { IState } from "../../reducers";
import { MapView } from "../play/components/mapView";
import { MapTemplateCacheEntry } from "../play/mapTemplateCache";
import { loadMapPreview } from "./mapPreview.actions";
import "./mapPreview.scss";

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
            <GridColumn className="col-xs-12">
                <GridRow>
                    {isLoading && <Loading />}
                    {!isLoading && (
                        <div className="map-preview">
                            <MapView mapTemplate={mapTemplate} />
                        </div>
                    )}
                </GridRow>
            </GridColumn>
        );
    }
}

export default connect(
    (state: IState) => ({
        isLoading: state.mapPreview.isLoading,
        mapTemplate: state.mapPreview.mapTemplate,
    }),
    (dispatch) => ({
        loadMapTemplate: (name: string) => {
            dispatch(loadMapPreview(name));
        },
        setTitle: (title: string) => {
            dispatch(setTitle(title));
        },
    })
)(MapPreviewerComponent);
