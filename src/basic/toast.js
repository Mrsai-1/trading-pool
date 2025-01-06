// import { toast } from 'react-toastify';
import toast from 'react-hot-toast';

export function toastFun(msg, type) {
  return toast[type](msg, {
    // icon: '👏',
    duration: 3000,
    position: 'top-center',
    style: {
      // borderRadius: '10px',
      // background: '#333',
      // color: '#fff',
      padding: '10px  40px',
    },
  });

  // return toast[type](msg, {
  //   position: 'top-center',
  //   autoClose: 5000,
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   pauseOnHover: true,
  //   draggable: true,
  //   progress: undefined,
  // });
}

/* eslint-disable */
