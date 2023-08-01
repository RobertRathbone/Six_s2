import storage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import reducer from './src/utils/reducer';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

export default persistedReducer;
