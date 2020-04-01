import * as React from "react";
import { Image, ImageProps } from "react-bootstrap";
import { getCachedClient } from "../../../clients/clientFactory";
import { imageBaseUri } from "../../../configuration";
import { MapClient, MapTemplate } from "../../../external/imperaClients";
import { Spinner } from "../spinner";
import { Link } from "react-router";

export interface IMapPreviewProps extends ImageProps {
    mapTemplateName: string;
}

export interface IMapPreviewState {
    mapTemplate: MapTemplate;
}

export class MapPreview extends React.Component<
    IMapPreviewProps,
    IMapPreviewState
> {
    constructor(props: IMapPreviewProps) {
        super(props);

        this.state = {
            mapTemplate: null,
        };
    }

    public componentWillReceiveProps(props: IMapPreviewProps) {
        if (this.props.mapTemplateName !== props.mapTemplateName) {
            this._updateState(props.mapTemplateName);
        }
    }

    public componentDidMount() {
        this._updateState(this.props.mapTemplateName);
    }

    public render() {
        const { mapTemplateName, ...nativeProps } = this.props;
        const { mapTemplate } = this.state;

        if (mapTemplate) {
            return (
                <Link to={`/game/mapPreview/${mapTemplate.name}`}>
                    <Image
                        src={
                            mapTemplate && `${imageBaseUri}${mapTemplate.image}`
                        }
                        {...nativeProps}
                    />
                </Link>
            );
        }

        return (
            <div className="text-center">
                <Spinner className="center-block" />
            </div>
        );
    }

    private _updateState(mapTemplateName: string) {
        this.setState(
            {
                mapTemplate: null,
            },
            () => {
                getCachedClient(MapClient)
                    .getMapTemplate(mapTemplateName)
                    .then(mapTemplate => {
                        this.setState({
                            mapTemplate,
                        });
                    });
            }
        );
    }
}
