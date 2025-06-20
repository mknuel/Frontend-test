// __mocks__/react-router-dom.ts
const actual = jest.requireActual("react-router-dom");

module.exports = {
	...actual,
	useNavigate: () => jest.fn(),
	useLocation: () => ({
		pathname: "/mock-path",
		search: "",
		hash: "",
		state: null,
	}),
	useParams: () => ({}),
	Link: ({ children, to }: any) => <a href={to}>{children}</a>,
	Navigate: ({ to }: any) => <div>Mock Navigate to {to}</div>,
};
