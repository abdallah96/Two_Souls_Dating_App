import { shallow } from "enzyme";
import {ToastContainer} from 'react-toastify';
import DateSuggestions from "../Suggestions/Suggestions";

describe("MyProfile", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(<DateSuggestions/>);
  });

  it('check if Sidenav is being used', () => {
    expect(wrapper.find(ToastContainer).length).toBe(1);
  });
  it('check if suggestion div exists', () => {
    expect(wrapper.find(".Suggestions").length).toBe(1);
  });
  it('check if profilephoto exists', () => {
    expect(wrapper.find(".profilephoto").length).toBe(1);
  });
  it('check if names exists', () => {
    expect(wrapper.find(".names").length).toBe(3);
  });
  it('check if distance exists', () => {
    expect(wrapper.find(".distance").length).toBe(2);
  });
});
