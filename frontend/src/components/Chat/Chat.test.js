import { Avatar } from "@material-ui/core";
import { shallow } from "enzyme";
import Chat from "./Chat";

describe("MyProfile", () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<Chat/>);
      });

    it('check if the button text is the same', () => {
        let header = wrapper.find(".sendbutton").text();
        expect(header).toBe("Send");
      });
      it('check if chatdetails footer div exists', () => {
        expect(wrapper.find(".chatdetails_footer").length).toBe(1);
      });
      it('check if chatdetails body div exists', () => {
        expect(wrapper.find(".chatdetails_body").length).toBe(1);
      });
      it('check if chatheader timestamp div exists', () => {
        expect(wrapper.find(".chatheader_timestamp").length).toBe(1);
      });
      it('check if chatdetails headerInfo div exists', () => {
        expect(wrapper.find(".chatdetails_headerInfo").length).toBe(1);
      });
      it('check if chatdetails header div exists', () => {
        expect(wrapper.find(".chatdetails_header").length).toBe(1);
      });
      it('check if chat details div exists', () => {
        expect(wrapper.find(".chat_details").length).toBe(1);
      });
      it('check if sidebarchat info div exists', () => {
        expect(wrapper.find(".sidebarchat_info").length).toBe(0);
      });
      it('check if sidebarchat innercontainer div exists', () => {
        expect(wrapper.find(".sidebarchat_innercontainer").length).toBe(0);
      });
      it('check if chat list div exists', () => {
        expect(wrapper.find(".chat_list").length).toBe(1);
      });
      it('check if chatcontainer body div exists', () => {
        expect(wrapper.find(".chatcontainer_body").length).toBe(1);
      });
      it('check if chatContainer body div exists', () => {
        expect(wrapper.find(".chatContainer").length).toBe(1);
      });
      it('check if sidebarchat name body div exists', () => {
        expect(wrapper.find(".sidebarchat_name").length).toBe(0);
      });
      it('check if Avatar is being used', () => {
        expect(wrapper.find(Avatar).length).toBe(1);
      });
})