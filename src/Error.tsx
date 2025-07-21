import React from "react";
import AceEditor from "react-ace";
import { strings } from "./strings";

export interface ErrorViewerProps {
    width: number;
    height: number;
    json: string;
    error: any;
}

/* eslint-disable max-lines-per-function */
export const ErrorViewer: React.FC<ErrorViewerProps> = ({ error, json, height }) => {

    return (
        <div className="errorView">
            <h3 className="errorHeader">{strings.error}</h3>
            <p className="error">
                <pre>
                    {error}
                </pre>
            </p>
            <h3 className="jsonHeader">{strings.jsonOptions}</h3>
            <AceEditor
                width="100%"
                height={`${height * (9 / 10)}px`}
                mode={"json5"}
                theme={"github"}
                setOptions={{
                    useWorker: false,
                    readOnly: true,
                }}
                value={json}
                name="CONFIGURATION_ID"
                editorProps={{ $blockScrolling: true }}
            />
        </div>
    );
};
