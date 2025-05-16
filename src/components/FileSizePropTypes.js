import PropTypes from "prop-types";

const FileSizePropTypes = {
  onLimitChange: PropTypes.func.isRequired,
  initialMaxSize: PropTypes.number.isRequired,
};

export default FileSizePropTypes;
