import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ToastProvider, useToast } from "../contexts/toast-context";
import ToastContainer from "./toast-container";

function TestComponent() {
	const { addToast } = useToast();
	return (
		<>
			<button
				type="button"
				onClick={() => addToast({ message: "Success!", type: "success" })}
			>
				Add Success
			</button>
			<button
				type="button"
				onClick={() => addToast({ message: "Error occurred", type: "error" })}
			>
				Add Error
			</button>
			<ToastContainer />
		</>
	);
}

describe("ToastContainer", () => {
	afterEach(() => {
		cleanup();
	});
	it("shows toast messages", async () => {
		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		fireEvent.click(screen.getByText("Add Success"));
		await waitFor(() => {
			expect(screen.getByText("Success!")).toBeInTheDocument();
		});
	});

	it("closes toast when clicked", async () => {
		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		fireEvent.click(screen.getByText("Add Success"));
		await waitFor(() => screen.getByText("Success!"));

		fireEvent.click(screen.getByLabelText("Close notification"));
		await waitFor(() => {
			expect(screen.queryByText("Success!")).not.toBeInTheDocument();
		});
	});
});
