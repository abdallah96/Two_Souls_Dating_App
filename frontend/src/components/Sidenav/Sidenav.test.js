import { shallow } from "enzyme";

import Sidenav from "./Sidenav";
import Event from "./Event/Event";
import Tab from '@mui/material/Tab';
import Chat from "../Chat/Chat";
import Profile from "../Profile/Profile";

describe("MyProfile", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(<Sidenav/>);
  });

  it('check if Event is being used', () => {
    expect(wrapper.find(Event).length).toBe(1);
  });
  it('check if Profile is being used', () => {
    expect(wrapper.find(Profile).length).toBe(1);
  });
  it('check if Chat is being used', () => {
    expect(wrapper.find(Chat).length).toBe(1);
  });
  it('check if three tabs exists in the sidenav', () => {
    expect(wrapper.find(Tab).length).toBe(3);
  });
});
