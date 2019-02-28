import { connect } from 'react-redux'
import { showFiles, loadingFiles } from '../store/gaia/actions'

export default connect(
  (state, redux) => {
    return {
      files: state.gaia.files,
    }
  },
  (dispatch, redux) => {
    return {
      refreshFiles: () => {
        dispatch(loadingFiles())
        dispatch(showFiles())
      },
    }
  }
)
