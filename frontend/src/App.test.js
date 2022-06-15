import { shallow } from "enzyme";
import App from './App'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Landing from './components/Landing/Landing'
import Admin from './components/Admin/Admin';
import SignUp from './components/SignUp/SignUp';
import ProfileDetails from './components/ProfileDetails/ProfileDetails';
import CoffeeDate from './components/Date/Date';
import Home from './components/Home/Home';
import Reports from './components/Reports/Reports';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

describe("MyProfile", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(<App/>);
  });

  it('check if Landing is not being used', () => {
    expect(wrapper.find(Landing).length).toBe(0);
  });
  it('check if Admin is  not being used', () => {
    expect(wrapper.find(Admin).length).toBe(0);
  });
  it('check if SignUp is  not being used', () => {
    expect(wrapper.find(SignUp).length).toBe(0);
  });
  it('check if ProfileDetails is  not being used', () => {
    expect(wrapper.find(ProfileDetails).length).toBe(0);
  });
  it('check if Routes is  not being used', () => {
    expect(wrapper.find(Routes).length).toBe(1);
  });
  it('check if CoffeeDate is being used', () => {
    expect(wrapper.find(CoffeeDate).length).toBe(0);
  });
  it('check if Home is being used', () => {
    expect(wrapper.find(Home).length).toBe(0);
  });
  it('check if Reports is  not being used', () => {
    expect(wrapper.find(Reports).length).toBe(0);
  });
  it('check if Signin is  not being used', () => {
    expect(wrapper.find(Signin).length).toBe(0);
  });
  it('check if BrowserRouter is being used', () => {
    expect(wrapper.find(BrowserRouter).length).toBe(1);
  });
  it('check if Register is being used', () => {
    expect(wrapper.find(Register).length).toBe(0);
  });
  it('check if Route is being used', () => {
    expect(wrapper.find(Route).length).toBe(10);
  });
});
