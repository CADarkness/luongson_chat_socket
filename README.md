# Update logs:

[21/10/2023]:

    * Thay đổi follow gửi tin nhắn

        - Mục đích: cải thiện hiệu xuất, hạn chế lỗi, có thể nhận biết được khi nào tin nhắn được gửi đi

        - Example: socket.emit("insert_chat", { messageObject, roomId })

        - Trong đó messageObject là kết quả sau khi gọi api Insert Chat

        - Đồng thời edit và xóa  cũng được thay dổi,

            + ví dụ:

                * socket.emit("edit_chat", { updatedMessageObject, roomId })

                * socket.emit("remove_chat", { removedMessageId, roomId })

[23/10/2023]:

    * Đơn giản hóa join room

        - Mục đích: cải thiện hiệu xuất, hạn chế lỗi

        - Example: `socket.emit("join_room", {
          userId: "user_id",
          roomId: "653116493c96eabfe9957fae",
        `});

[27/10/2023]:

    * Lên kế hoạch nén dữ liệu khi socket gửi dữ liệu về client

[28/10/2023]:

    * ---------------------------------------------------------

[31/10/2023]

    * Khắc phục sự cố không thể gửi event tới 1 những client được chỉ định

    * Nâng cấp event send_notify

        - Mục đích: có thể send thông báo tới toàn bộ hoặc 1, 1 vài đối tượng chỉ định => nâng cao hiệu năng

            + Ví dụ: để send thông báo tới 1 user cụ thể
            ```
            socket.emit("send_notify", {
                key: "string",
                data: "any",
                userIds: ["user_object_id"]
            })
            ```

            + Ví dụ: để send thông báo tới toàn bộ:
            ```
            socket.emit("send_notify", {
                key: "string",
                data: "any",
            })
            ```
