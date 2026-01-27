import { Area } from 'react-easy-crop';
import { create } from 'zustand';

interface InitialState {
	isCropperOpen: boolean;
	avatarImage: string | null;

	zoom: number;
	crop: { x: number; y: number };
	croppedAreaPixels: Area | null;

	setZoom: (zoom: number) => void;
	setCrop: (crop: { x: number; y: number }) => void;
	setCroppedAreaPixels: (area: Area) => void;

	setOpenCropper: (image: string) => void;
	setCloseCropper: () => void;
}

export const useCropperModal = create<InitialState>((set) => ({
	isCropperOpen: false,
	avatarImage: null,

	zoom: 1,
	crop: { x: 0, y: 0 },
	croppedAreaPixels: null,

	setZoom: (zoom) => set({ zoom }),
	setCrop: (crop) => set({ crop }),
	setCroppedAreaPixels: (area) => set({ croppedAreaPixels: area }),

	setOpenCropper: (image) =>
		set({
			avatarImage: image,
			isCropperOpen: true,
			zoom: 1,
			crop: { x: 0, y: 0 },
			croppedAreaPixels: null,
		}),

	setCloseCropper: () =>
		set({
			isCropperOpen: false,
			avatarImage: null,
		}),
}));
