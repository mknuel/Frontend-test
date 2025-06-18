import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { JSX } from "react";
import { toast, type ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info";

type NotifyArgs = {
	title?: string;
	message?: string;
	options?: ToastOptions;
};

const iconMap: Record<ToastType, JSX.Element> = {
	success: <CheckCircle2 size="24" color="#ffffff" />,
	error: <AlertTriangle size="24" color="#ffffff" />,
	info: <Info size="24" color="#ffffff" />,
};

const notifyBase = (
	type: ToastType,
	{ title, message, options }: NotifyArgs
) => {
	const fallback = {
		success: { title: "Success", message: "Action completed successfully." },
		error: { title: "Error", message: "Something went wrong." },
		info: { title: "Info", message: "Here is some information." },
	};

	const content = (
		<div className="flex gap-3 items-start py-3 px-2">
			<div className="mt-0">{iconMap[type]}</div>
			<div className="flex flex-col ">
				<strong className="text-white font-semibold leading-tight mb-2">
					{title || fallback[type].title}
				</strong>
				<span className="text-white text-sm font-medium">
					{message || fallback[type].message}
				</span>
			</div>
		</div>
	);

	toast(content, {
		type,
		icon: false,
		closeButton: ({ closeToast }) => (
			<button
				onClick={closeToast}
				className="absolute top-0 right-2 text-white hover:text-gray-300 cursor-pointer text-xl">
				&times;
			</button>
		),
		...options,
	});
};

export const notify = {
	success: (args: NotifyArgs) => notifyBase("success", args),
	error: (args: NotifyArgs) => notifyBase("error", args),
	info: (args: NotifyArgs) => notifyBase("info", args),
};
