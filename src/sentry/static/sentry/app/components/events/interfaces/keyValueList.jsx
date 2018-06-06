import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import ContextData from '../../contextData';
import {deviceNameMapper} from '../../../utils';
import ExternalLink from '../../externalLink';

const KeyValueList = React.createClass({
  propTypes: {
    data: PropTypes.any.isRequired,
    isContextData: PropTypes.bool,
    isSorted: PropTypes.bool,
    onClick: PropTypes.func,
    raw: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      isContextData: false,
      isSorted: true,
      raw: false,
    };
  },

  render() {
    // TODO(dcramer): use non-string keys as reserved words ("unauthorized")
    // break rendering

    let data = this.props.data;
    if (data === undefined || data === null) {
      data = [];
    } else if (!(data instanceof Array)) {
      data = Object.keys(data).map(key => [key, data[key]]);
    }

    data = this.props.isSorted ? _.sortBy(data, [(key, value) => key]) : data;
    let raw = this.props.raw;
    const props = this.props.onClick ? {onClick: this.props.onClick} : {};
    return (
      <table className="table key-value" {...props}>
        <tbody>
          {data.map(([key, value]) => {
            if (this.props.isContextData) {
              if (key === 'traceId') {
                return [
                  <tr key={key}>
                    <td className="key">{key}</td>
                    <td className="value">
                      <ExternalLink herf="http://kibana5.devops.xiaohongshu.com/">
                        {value}
                      </ExternalLink>
                    </td>
                  </tr>,
                ];
              }
              if (key === 'sampled') {
                if (value === 'true') {
                  let link = `https://zipkin.devops.xiaohongshu.com/zipkin/traces/${value}`;
                  return <ExternalLink herf={link}>'Zipkin'</ExternalLink>;
                }
                return [];
              } else {
                return [
                  <tr key={key}>
                    <td className="key">{key}</td>
                    <td className="value">
                      <ContextData data={!raw ? value : JSON.stringify(value)} />
                    </td>
                  </tr>,
                ];
              }
            } else {
              return [
                <tr key={key}>
                  <td className="key">{key}</td>
                  <td className="value">
                    <pre>{deviceNameMapper('' + value || ' ')}</pre>
                  </td>
                </tr>,
              ];
            }
          })}
        </tbody>
      </table>
    );
  },
});

export default KeyValueList;
