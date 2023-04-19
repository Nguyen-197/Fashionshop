
export enum menuLeftPopuptAction {
    None,
    RequestModal,
    ErrorModal,
    DoneModal
}

const initialState = {
    action: menuLeftPopuptAction.None,
    errorMessage: null,
    errorItems: [],
    notificationNumber: null,
    companyName: null,
    servicesInfo: [],
    expand: true,
    dataStatusOpenFeedback: null,
    statusContract: null,
    servicesOrder: null,
    changeSuccessId: null,
    updatedDate: null,
    isDisplayFirstScreen: null,
    loading: false,
    isAdmin: null
};


export type MenuLeftState = Readonly<typeof initialState>;

export default (state: MenuLeftState = initialState, action): MenuLeftState => {
    switch (action.type) {
      case 1:
      case 1:
      default:
        return state;
    }
  };

