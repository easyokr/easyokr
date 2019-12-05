import React, { Component } from 'react';
import { Chart, Geom, Coord, Guide } from "bizcharts";
import DataSet from "@antv/data-set";

class Pie extends Component {
    render() {
        const { DataView } = DataSet;
        const { Html } = Guide;
        const dv = new DataView();
        dv.source(this.props.data).transform({
            type: "percent",
            field: "count",
            dimension: "color",
            as: "percent"
        });
        const cols = {
            percent: {
                formatter: val => {
                    val = val * 100 + "%";
                    return val;
                }
            }
        };
        return (
            <Chart
                height={this.props.height}
                padding={[0, 0, 0, 0]}
                data={dv}
                scale={cols}
                forceFit
                animate={true}>
                <Coord type={"theta"} radius={0.75} innerRadius={0.6} />

                <Guide>
                    <Html
                        position={["50%", "50%"]}
                        html={"<div style='color:#262626;font-size:1em;font-weight:450;text-align: center;width: 10em;'>"
                            + this.props.title + "</div>"}
                        alignX="middle"
                        alignY="middle"
                    />
                </Guide>


                <Geom
                    type="intervalStack"
                    position="percent"
                    color={['color', c => {
                        switch (c) {
                            case 'green':
                                return 'rgb(34, 215, 187)'
                            case 'yellow':
                                return 'rgb(255, 196, 66)'
                            case 'red':
                                return 'rgb(255, 69, 64)'
                            default:
                                return 'rgb(221, 221, 221)'
                        }
                    }]}
                    style={{
                        lineWidth: 1,
                        stroke: "#fff"
                    }}
                    animate={{
                        appear: {
                            animation: 'delayScaleInY',
                            easing: 'easeElasticOut'
                        }
                    }}
                >
                </Geom>
            </Chart>
        );
    }
}

export default Pie