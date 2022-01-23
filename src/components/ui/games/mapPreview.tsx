import * as React from "react";

import Image, { ImageProps } from "react-bootstrap/Image";

import Link from "next/link";
import { MapTemplate } from "../../../external/imperaClients";
import { Spinner } from "../spinner";
import { fetchMapTemplate } from "../../../lib/domain/game/play/mapTemplateCache";
import { imageBaseUri } from "../../../configuration";
import { useAppSelector } from "../../../store";

export interface IMapPreviewProps extends ImageProps {
    mapTemplateName: string;
}

export interface IMapPreviewState {
    mapTemplate: MapTemplate;
}

export const MapPreview: React.FC<IMapPreviewProps> = (props) => {
    const { mapTemplateName, ...nativeProps } = props;

    const [mapTemplate, setMapTemplate] = React.useState<
        MapTemplate | undefined
    >();

    const token = useAppSelector((s) => s.session.access_token);

    React.useEffect(() => {
        let cancelled = false;

        fetchMapTemplate(token, mapTemplateName).then((mt) => {
            if (!cancelled) {
                setMapTemplate(mt);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [mapTemplateName]);

    if (mapTemplate) {
        return (
            <Link
                href="/game/mapPreview/[map]"
                as={`/game/mapPreview/${mapTemplate.name}`}
            >
                <Image
                    src={mapTemplate && `${imageBaseUri}${mapTemplate.image}`}
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
};
