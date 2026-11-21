"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitLeadAction } from "@/app/(site)/actions";

export default function ContactForm({ interests, defaultInterest }: { interests: string[]; defaultInterest?: string }) {
  const [state, action, pending] = useActionState(submitLeadAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Bấm "Đặt hàng ngay" ở thẻ sản phẩm → điền sẵn tên sản phẩm vào ghi chú.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("[data-product]");
      const msg = formRef.current?.elements.namedItem("message");
      if (a && msg instanceof HTMLTextAreaElement) msg.value = `Tôi quan tâm sản phẩm: ${a.getAttribute("data-product")}`;
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} className="form" action={action} noValidate>
      <h3>Đăng ký tư vấn</h3>
      <div className="field">
        <label htmlFor="name">Họ và tên *</label>
        <input id="name" name="name" required maxLength={80} placeholder="Nguyễn Văn A" autoComplete="name" />
        {state?.errors?.name && <span className="err">{state.errors.name}</span>}
      </div>
      <div className="field">
        <label htmlFor="phone">Số điện thoại *</label>
        <input id="phone" name="phone" type="tel" required maxLength={20} placeholder="09xx xxx xxx" autoComplete="tel" />
        {state?.errors?.phone && <span className="err">{state.errors.phone}</span>}
      </div>
      <div className="field">
        <label htmlFor="interest">Loại cầu thang quan tâm</label>
        <select id="interest" name="interest" defaultValue={defaultInterest}>
          {interests.map((x) => (
            <option key={x}>{x}</option>
          ))}
          <option>Chưa biết, cần tư vấn</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Ghi chú</label>
        <textarea id="message" name="message" rows={3} maxLength={1000} placeholder="Địa chỉ công trình, chiều cao tầng, yêu cầu riêng..." />
      </div>
      <div className="hp" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button className="btn btn-accent" type="submit" disabled={pending}>
        {pending ? "Đang gửi..." : "Gửi yêu cầu"}
      </button>
      {state?.ok && <div className="form-msg show">Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất có thể.</div>}
      {state?.errors && <div className="form-msg show bad">Vui lòng nhập họ tên và số điện thoại hợp lệ.</div>}
    </form>
  );
}
