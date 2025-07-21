import { render, screen, fireEvent } from "@testing-library/react";
import ImageCarousel from "@/app/components/ImageCarousel";

const images = [
  {
    title: "Image 1",
    url: "/img1.jpg",
    altText: "First image",
    credit: "Photographer A",
  },
  {
    title: "Image 2",
    url: "/img2.jpg",
    altText: "Second image",
    credit: "Photographer B",
  },
];

describe("ImageCarousel", () => {
  it("renders fallback text if no images", () => {
    render(<ImageCarousel images={[]} />);
    expect(screen.getByText(/no images available/i)).toBeInTheDocument();
  });

  it("renders first image initially", () => {
    render(<ImageCarousel images={images} />);
    expect(screen.getByRole("heading")).toHaveTextContent("Image 1");
    expect(screen.getByRole("img")).toHaveAttribute("src", "/img1.jpg");
  });

  it("navigates to next and previous images", () => {
    render(<ImageCarousel images={images} />);
    
    const nextButton = screen.getByRole("button", { name: /next image/i });
    const prevButton = screen.getByRole("button", { name: /previous image/i });

    // Click next: should show Image 2
    fireEvent.click(nextButton);
    expect(screen.getByRole("heading")).toHaveTextContent("Image 2");

    // Click next again: should loop back to Image 1
    fireEvent.click(nextButton);
    expect(screen.getByRole("heading")).toHaveTextContent("Image 1");

    // Click prev: should go to Image 2
    fireEvent.click(prevButton);
    expect(screen.getByRole("heading")).toHaveTextContent("Image 2");
  });
});
