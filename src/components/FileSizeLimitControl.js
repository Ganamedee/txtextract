import React, { useState } from "react";
import PropTypes from "prop-types";
import "./FileSizeLimitControl.css";

const FileSizeLimitControl = ({ onLimitChange }) => {
  const [limit, setLimit] = useState(0); // 0 = no limit

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    setLimit(value);
    if (onLimitChange) {
      onLimitChange(value);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "No limit";
    if (bytes < 1024) return `${bytes} KB`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} MB`;
    return `${Math.round(bytes / (1024 * 1024))} GB`;
  };

  return (
    <div className="size-limit-control">
      <div className="size-limit-header">
        <h4>File Size Limit</h4>
        <span className="size-display">{formatSize(limit)}</span>
      </div>
      <input
        type="range"
        min="0"
        max="200000" // 200MB in KB
        value={limit}
        onChange={handleChange}
        className="size-slider"
      />
      <div className="size-ticks">
        <span>1KB</span>
        <span>1MB</span>
        <span>10MB</span>
        <span>100MB</span>
        <span>200MB</span>
      </div>
    </div>
  );
};

FileSizeLimitControl.propTypes = {
  onLimitChange: PropTypes.func,
};

export default FileSizeLimitControl;
