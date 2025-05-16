import React from "react";
import PropTypes from "prop-types";

const FileSizeLimitControl = ({ maxSize, onSizeChange }) => {
  const handleChange = (e) => {
    onSizeChange(Number(e.target.value));
  };

  return (
    <div className="file-size-control">
      <label>
        Max File Size (MB):
        <input
          type="range"
          min="0"
          max="100"
          value={maxSize}
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

FileSizeLimitControl.propTypes = {
  maxSize: PropTypes.number.isRequired,
  onSizeChange: PropTypes.func.isRequired,
};

export default FileSizeLimitControl;
